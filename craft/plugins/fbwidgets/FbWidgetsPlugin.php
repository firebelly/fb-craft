<?php

namespace Craft;

class FbWidgetsPlugin extends BasePlugin
{
  function getName()
  {
    return Craft::t('Firebelly Widgets');
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
