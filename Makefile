all: run

run:
	gunicorn -w 1 --threads 8 web:app

clean:
	rm -rf $(TRG)

requirements.txt:
	@cat $@ | cut -d"=" -f1 | xargs pip uninstall -y
	pip install -U pip
	pip install -r requirements.base.txt
	pip freeze > $@

.PHONY: requirements.txt
	