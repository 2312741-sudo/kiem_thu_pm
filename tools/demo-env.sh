# Dùng khi PostgreSQL của đề tài chạy ở cổng 5433 (vì cổng 5432 bị Postgres.app bản 18 chiếm).
# Cách dùng: source tools/demo-env.sh   (rồi chạy yarn dev hoặc npm run ... trong cùng cửa sổ Terminal)
export DATABASE_URL="postgresql://postgres:@localhost:5433/calendso"
export DATABASE_DIRECT_URL="postgresql://postgres:@localhost:5433/calendso"
export PGPORT=5433
