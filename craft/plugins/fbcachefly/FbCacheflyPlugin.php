<?php

namespace Craft;

class FbCacheflyPlugin extends BasePlugin
{

  function getName()
  {
    return Craft::t('Firebelly CacheFly helper');
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

  public function init()
  {
    // Hook into Craft asset events to purge cachefly assets on upload/replace/delete
    craft()->on('assets.onSaveAsset', function (Event $event) {
      $this->purgeAsset($event->params['asset']);
    });
    craft()->on('assets.onReplaceFile', function (Event $event) {
      $this->purgeAsset($event->params['asset']);
    });
    craft()->on('assets.onBeforeDeleteAsset', function (Event $event) {
      $this->purgeAsset($event->params['asset']);
    });
  }

  public function purgeAsset(AssetFileModel $asset)
  {
    // Make sure we're using cachefly as the CDN (CDNURL is set in .env)
    if (getenv('CDN_APIKEY') && strpos(getenv('CDN_URL'), 'cachefly') !== FALSE) {
      // POST to cachefly API to purge the file
      $url = 'https://'.getenv('CDN_APIKEY').'@api.cachefly.com/1.0/purge.purge.file';
      $data = array('files' => base64_encode('/' . $this->getAssetPath($asset)));
      $options = array(
        'http' => array(
          'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
          'method'  => 'POST',
          'content' => http_build_query($data)
          )
        );
      $context  = stream_context_create($options);
      $result = file_get_contents($url, false, $context);
      if ($result === FALSE) {
        throw new CraftException( Craft::t('Unable to purge cachefly API for '.$this->getAssetPath($asset)) );
      }
    }
  }

  // Borrowed from https://github.com/jonnnnyw/craft-awss3assets
  private function getAssetPath(AssetFileModel $asset)
  {
    if ($asset->getSource()->type != 'Local') {
      throw new Exception(Craft::t('Could not get asset upload path as source is not "Local"'));
    }

    $sourcePath = $asset->getSource()->settings['path'];
    $folderPath = $asset->getFolder()->path;

    return $sourcePath . $folderPath . $asset->filename;
  }

}
