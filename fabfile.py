from fabric.api import *
import os
from os.path import join,dirname
from dotenv import load_dotenv
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

env.hosts = ['craft.firebelly.co']
env.user = 'firebelly'

env.path = '/Users/nate/Sites/fb-craft'
env.remotepath = '/home/firebelly/webapps/fb_craft'
env.git_branch = 'master'
env.warn_only = True

def production():
	env.user = 'firebelly'
	env.hosts = ['craft.firebelly.co']
	env.remotepath = '/home/firebelly/webapps/fb_craft'

def assets():
	local('node_modules/.bin/gulp --production')

def deploy():
	update()
	# clear_cache()

def update():
	with cd(env.remotepath):
		run('git pull origin %s' % env.git_branch)

# def clear_cache():
# 	with cd(env.remotepath):
# 		run('rm -rf cache/data/*')

def pushdb():
	local("mysqldump -u "+os.environ.get('DB_USER')+" -p'"+os.environ.get('DB_PASS') +
		"' "+os.environ.get('DB_NAME')+" | gzip -9 > ~/temp_db.sql.gz")
	# scp dump to remote
	local("scp ~/temp_db.sql.gz "+env.user+"@"+env.hosts[0]+":")
	# shove dump into production db
	run("zcat ~/temp_db.sql.gz | mysql --user='"+os.environ.get('REMOTE_DB_USER') +
		"' --password='"+os.environ.get('REMOTE_DB_PASS') +
		"' --database "+os.environ.get('REMOTE_DB_NAME'))
	# cleanup files from local & remote
	run("rm ~/temp_db.sql.gz")
	local("rm ~/temp_db.sql.gz")

# def pullassets():
#   local('rsync -avz fabricuser@123.456.78.90:{0} {1}'.format(remotePath, localPath))