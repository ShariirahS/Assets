.PHONY: test format migrate seed backend-test frontend-test lint-backend lint-frontend

## Placeholder test aggregate
test: backend-test frontend-test
	@echo "Aggregate test placeholder"

backend-test:
	@echo "Backend tests not yet implemented"
	# pytest --maxfail=1 --disable-warnings

frontend-test:
	@echo "Frontend tests not yet implemented"
	# npm run test -- --watch=false

format: lint-backend lint-frontend
	@echo "Formatting placeholder"

lint-backend:
	@echo "Backend lint placeholder"
	# ruff check backend

lint-frontend:
	@echo "Frontend lint placeholder"
	# npm run lint

migrate:
	@echo "Database migrations placeholder"
	# python manage.py migrate

seed:
	@echo "Database seed placeholder"
	# python manage.py loaddata initial_data.json
