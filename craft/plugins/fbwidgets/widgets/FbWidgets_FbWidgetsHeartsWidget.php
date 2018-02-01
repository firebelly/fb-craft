<?php
namespace Craft;

class FbWidgets_FbWidgetsHeartsWidget extends BaseWidget
{
    public function getName()
    {
        return Craft::t('Beautiful Trio of Love');
    }

    public function getBodyHtml()
    {
        $imagePath = UrlHelper::getResourceUrl('fbwidgets/slideshowimages/hearts.gif');
        return '<img src="'.$imagePath.'" style="max-width: 100%;width: 100%;">';
    }
}