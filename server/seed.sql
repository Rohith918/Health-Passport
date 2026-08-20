
COPY hp_users(id, email, first_name, last_name, password_hash, created_at)
FROM '/data/hp_users.csv'
DELIMITER ','
CSV HEADER;

-- Seed hp_readings_heart
-- Expected CSV format: id,user_id,date,systolic,diastolic,heart_rate,total_cholesterol,hdl,ldl,vldl,triglycerides,created_at
COPY hp_readings_heart(id, user_id, date, systolic, diastolic, heart_rate, total_cholesterol, hdl, ldl, vldl, triglycerides, created_at)
FROM '/data/hp_readings_heart.csv'
DELIMITER ','
CSV HEADER;

-- Seed hp_readings_glucose
-- Expected CSV format: id,user_id,date,fasting_glucose,postprandial_glucose,hba1c,created_at
COPY hp_readings_glucose(id, user_id, date, fasting_glucose, postprandial_glucose, hba1c, created_at)
FROM '/data/hp_readings_glucose.csv'
DELIMITER ','
CSV HEADER;

-- Seed hp_readings_liver
-- Expected CSV format: id,user_id,date,alt,ast,bilirubin,created_at
COPY hp_readings_liver(id, user_id, date, alt, ast, bilirubin, created_at)
FROM '/data/hp_readings_liver.csv'
DELIMITER ','
CSV HEADER;

-- Seed hp_prescriptions
-- Expected CSV format: id,user_id,filename,file_type,date,notes,file_data,created_at
COPY hp_prescriptions(id, user_id, filename, file_type, date, notes, file_data, created_at)
FROM '/data/hp_prescriptions.csv'
DELIMITER ','
CSV HEADER;