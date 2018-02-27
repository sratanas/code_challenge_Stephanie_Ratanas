CREATE TABLE "users" (
  "id" serial primary key,
  "username" VARCHAR(80) not null UNIQUE,
  "password" VARCHAR(240),
  "name" VARCHAR (50),
  "role" VARCHAR(20),
  "email" VARCHAR(50),
  "phone" VARCHAR(15),
  "created_at" TIMESTAMP WITH TIME ZONE,
  "updated_at" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE "shifts" (
  "id" serial primary key,
  "manager_id" INT REFERENCES "users"(id),
  "break" FLOAT,
  "start_time" TIMESTAMP WITH TIME ZONE,
  "end_time" TIMESTAMP WITH TIME ZONE,
  "created_at" TIMESTAMP WITH TIME ZONE,
  "updated_at" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE employee_shifts (
  "id" serial primary key,
  "employee_id" INT REFERENCES "users"(id),
  "shift_id" INT REFERENCES "shifts"(id)
  );


--Dummy data for employees
INSERT INTO users ("username", "name", "role", "email", "phone", "created_at")
VALUES ('Mary', 'Mary Smith', 'employee', 'mary@mary.com', 1234567890, current_timestamp),
	   ('Jeff', 'Jeff Jones', 'employee', 'jeff@jeff.com', 1234567890, current_timestamp),
	   ('Sandy', 'Sandy Doe', 'employee', 'sandy@sandy.com', 1234567890, current_timestamp),
	   ('Bob', 'Bob Barker', 'employee', 'bob@bob.com', 1234567890, current_timestamp);
