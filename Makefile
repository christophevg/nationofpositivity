all: run
	
run:
	gunicorn -k eventlet -w 1 shop:server

requirements.txt:
	@cat $@ | cut -d"=" -f1 | xargs pip uninstall -y
	pip install -U pip
	pip install -r requirements.base.txt
	pip freeze > $@

.PHONY: requirements.txt

ip:
	nslookup myip.opendns.com resolver1.opendns.com

DB?=nation
COLLECTION?=products
FILE?=${COLLECTION}

test:
	echo ${FILE}

export-production:
	@echo "*** exporting from remote '${COLLECTION}'..."
	@. ./.env.local; mongoexport --uri=$$URI --collection=${COLLECTION} --username=$$MONGO_USER --password=$$MONGO_PASS --db=${DB} --out=local/${FILE}.json

import-production:
	@echo "*** importing to remote '${COLLECTION}'..."
	@. ./.env.local; mongoimport --uri=$$URI --collection=${COLLECTION} --drop --username=$$MONGO_USER --password=$$MONGO_PASS --db=${DB} local/${FILE}.json

export-local:
	@echo "*** exporting from local '${COLLECTION}'..."
	@mongoexport --collection=${COLLECTION} --db=${DB} --out=local/${FILE}.json

import-local:
	@echo "*** importing to local '${COLLECTION}'..."
	@mongoimport --collection=${COLLECTION} --drop --db=${DB} local/${FILE}.json

sync-from-production: export-production import-local

sync-to-production: export-local import-production
