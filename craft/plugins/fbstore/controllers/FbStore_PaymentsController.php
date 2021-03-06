<?php

namespace Craft;

class FbStore_PaymentsController extends BaseController
{
  protected $allowAnonymous = true;

  public function actionCharge()
  {
    $this->requirePostRequest();
    $this->requireAjaxRequest();

    // Parse JSON objects sent from js
    $token  = json_decode($_POST['token']); // Stripe token->id and token->email
    $customer  = json_decode($_POST['customer']); // customer billing/shipping info sent from Stripe Checkout
    $cart  = json_decode($_POST['cart']); // localstorage cart with line items and shipping info
    // Set customer email
    $customer->email = $token->email;

    // Check if token was sent
    if (empty($token->id)) {
      $this->returnErrorJson('No payment token sent.');
    }

    // Check for INT'L shipping for non-USA order (or vice versa)
    if ($customer->shipping_address_country_code != 'US' && $cart->shipping->type == 'US') {
      $this->returnErrorJson('Please select INT\'L shipping for a non-USA address.');
    } else if ($customer->shipping_address_country_code == 'US' && $cart->shipping->type != 'US') {
      $this->returnErrorJson('Please select USA shipping for a USA address.');
    }

    try {
      // Init Stripe using .env credentials
      \Stripe\Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));

      // Loop through customers to find by email in case they're returning
      $allCustomers = \Stripe\Customer::all()->data;
      foreach ($allCustomers as $chkCustomer) {
        if ($chkCustomer->email == $customer->email) {
          $stripeCustomer = $chkCustomer;
          // Update payment source
          $stripeCustomer->source = $token->id;
          $stripeCustomer->save();
          break;
        }
      }

      // ...or create new Stripe customer to relate to order
      if (empty($stripeCustomer)) {
        $stripeCustomer = \Stripe\Customer::create(array(
          'email' => $customer->email,
          'source'  => $token->id
        ));
      }

      // If we ever just want to switch to a simple charge instead of Orders
      // $charge = \Stripe\Charge::create(array(
      //   'customer' => $customer->id,
      //   'amount'   => $cart->total,
      //   'currency' => 'usd'
      // ));

      // Build $items array to associate with order
      $items = array();
      foreach ($cart->items as $cartItem) {
        $items[] = array(
          'type' => 'sku',
          'parent' => $cartItem->stripe_product_id,
          'quantity' => $cartItem->quantity
        );
      }

      // Add hacky shipping as a line item, with quantity set on US orders with 2+ books (set in js)
      $items[] = array(
        'type' => 'sku',
        'parent' => 'sku_ship' . $cart->shipping->type,
        'quantity' => $cart->shipping->quantity
      );

      // Create order in Stripe
      $order = \Stripe\Order::create(array(
        'currency' => 'usd',
        'customer' => $stripeCustomer->id,
        'items' => $items,
        'shipping' => array(
            'name' => $customer->shipping_name,
            'address' => array(
              'line1' => $customer->shipping_address_line1,
              'city' => $customer->shipping_address_city,
              'country' => $customer->shipping_address_country_code,
              'postal_code' => $customer->shipping_address_zip
            )
          ),
      ));

      // Submit payment for order using customer payment source
      $order_details = $order->pay(array(
        'customer' => $stripeCustomer->id,
        'source' => $stripeCustomer->sources->data[0]->id
      ));

      // Customer order email
      $emailSettings = craft()->email->getSettings();
      $email = new EmailModel();
      $email->fromEmail = $emailSettings['emailAddress'];
      $email->fromName = $emailSettings['senderName'];
      $email->toEmail = $customer->email;
      $email->subject = 'Your Firebelly Order';
      $email->body = craft()->templates->render('store/order_email_text', array(
        'customer' => $customer,
        'cart' => $cart,
        'card' => $stripeCustomer->sources->data[0],
      ));
      $html_order_email = craft()->templates->render('store/order_email', array(
        'customer' => $customer,
        'cart' => $cart,
        'card' => $stripeCustomer->sources->data[0],
      ));
      // Inline the CSS
      $emogrifier = new \Pelago\Emogrifier($html_order_email);
      $email->htmlBody = $emogrifier->emogrify();
      craft()->email->sendEmail($email);

      // Shop order email
      $email->toEmail = 'nate@firebellydesign.com';
      $email->replyTo = $customer->email;
      if (!craft()->config->get('devMode')) {
        $email->cc = array(
            array('email' => 'dawn@firebellydesign.com', 'name' => 'Dawn Hancock'),
        );
      }
      $email->subject = 'New Firebelly order for ' . $customer->billing_name;
      $email->body = craft()->templates->render('store/order_email_shop_text', array(
        'customer' => $customer,
        'cart' => $cart,
        'card' => $stripeCustomer->sources->data[0],
      ));
      $html_order_email = craft()->templates->render('store/order_email_shop', array(
        'customer' => $customer,
        'cart' => $cart,
        'card' => $stripeCustomer->sources->data[0],
      ));
      // Inline the CSS
      $emogrifier = new \Pelago\Emogrifier($html_order_email);
      $email->htmlBody = $emogrifier->emogrify();
      craft()->email->sendEmail($email);

    } catch (\Stripe\Error\Base $e) {
      $this->returnErrorJson($e->getMessage());
    } catch (Exception $e) {
      $this->returnErrorJson($e->getMessage());
    }

    $this->returnJson(array('success' => true, 'message' => 'Order processed ok!'));
  }
}
