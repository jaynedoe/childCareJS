CREATE TABLE centres
(
	id INT NOT NULL AUTO_INCREMENT,
	centreName VARCHAR (255),
	serviceType VARCHAR (255),
	suburb VARCHAR (255),
	postcode INT,
	centreSize VARCHAR (255),
	rating VARCHAR (255),
	longDayCare VARCHAR (3),
	kinderPartOfSchool VARCHAR (3),
	kinderStandalone VARCHAR (3),
	afterSchoolCare VARCHAR (3),
	beforeSchoolCare VARCHAR (3),
	vacationCare VARCHAR (3),
	costPerDay INT,
	PRIMARY KEY (id)
);










