<?php namespace Craft;

class CacheClearController extends BaseController {

	/**
	 * Allow anonymous access to the controller.
	 *
	 * @var array
	 */
	protected $allowAnonymous = array('actionClear');

	/**
	 * Handle the action to clear the cache.
	 */
	public function actionClear()
	{
		if (!$plugin = craft()->plugins->getPlugin('cacheClear')) {
			die('Could not find the plugin');
		}

		$settings = $plugin->getSettings();

		$key = craft()->request->getParam('key');

		if (!$settings->key OR $key != $settings->key) {
			die('Unauthorized key');
		}

		craft()->templateCache->deleteAllCaches();

		// Check for htmlcache plugin and clear also
		$htmlcache_plugin = craft()->plugins->getPlugin('htmlcache', false);
		if ($htmlcache_plugin->isInstalled && $htmlcache_plugin->isEnabled) {
			craft()->htmlcache_htmlcache->clearCacheFiles();
		}

		if (craft()->request->getPost('redirect')) {
			$this->redirectToPostedUrl();
		}

		die('Your cache cleared successfully!');
	}
}
