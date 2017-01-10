<?php

namespace Craft;

class FbStorePlugin extends BasePlugin
{
  // function init()
  // {
  //   require CRAFT_BASE_PATH.'../vendor/autoload.php';
  // }

  function getName()
  {
    return Craft::t('Firebelly Store Orders');
  }

  function getVersion()
  {
    return '1.0';
  }

  function getDeveloper()
  {
    return 'Firebelly';
  }

  function getDeveloperUrl()
  {
    return 'https://www.firebellydesign.com';
  }
}
