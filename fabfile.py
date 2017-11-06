from fabric.api import *
import os

env.hosts = ['craft.firebelly.co']
env.user = 'firebelly'
env.path = '/Users/nate/Sites/fb-craft'
env.remotepath = '/home/firebelly/webapps/fb_craft'
env.git_branch = 'master'
env.warn_only = True
env.remote_protocol = 'http'

def production():
  env.hosts = ['www.firebellydesign.com']
  env.user = 'deployer'
  env.remotepath = '/var/www/fb-craft/'
  env.remote_protocol = 'https'
  # env.user = 'firebelly'
  # env.remotepath = '/home/firebelly/webapps/fb_craft'

def assets():
  local('npx gulp --production')

def devsetup():
  print "Install composer, node and bower assets...\n"
  local('composer install')
  local('npm install')
  local('cd public/assets && bower install')
  local('npx gulp')
  local('cp .env-example .env')
  print "OK DONE! Hello? Are you still awake?\nEdit your .env file with local credentials\nRun `npx gulp watch` to run local gulp to compile & watch assets"

def deploy():
  update()
  composer_install()
  clear_cache()

def update():
  with cd(env.remotepath):
    run('git pull origin {0}'.format(env.git_branch))

def composer_install():
  with cd(env.remotepath):
    run('~/bin/composer install')

def clear_cache():
  run ('curl -vs -o /dev/null {0}://{1}/actions/cacheClear/clear?key=fbclear > /dev/null 2>&1'.format(env.remote_protocol, env.hosts[0]))
