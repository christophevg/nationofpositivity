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

DB=nation
COLLECTION=products

export-production:
	@echo "*** exporting remote '${COLLECTION}'..."
	@. ./.env.local; mongoexport --uri=$$URI --collection=${COLLECTION} --username=$$MONGO_USER --password=$$MONGO_PASS --db=${DB} --out=local/${COLLECTION}.json

import-local:
	@echo "*** importing locally '${COLLECTION}'..."
	@mongoimport --collection=${COLLECTION} --drop --db=${DB} local/${COLLECTION}.json

sync: export-production import-local
