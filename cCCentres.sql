CREATE TABLE centres
(
	id INTEGER NOT NULL,
	centreName VARCHAR (255),
	serviceType VARCHAR (255),
	suburb VARCHAR (255),
	postcode INTEGER,
	centreSize VARCHAR (255),
	rating VARCHAR (255),
	longDayCare VARCHAR (3),
	kinderPartOfSchool VARCHAR (3),
	kinderStandalone VARCHAR (3),
	afterSchoolCare VARCHAR (3),
	beforeSchoolCare VARCHAR (3),
	vacationCare VARCHAR (3),
	temporarilyClosed VARCHAR (3),
	costPerDay INTEGER,
	PRIMARY KEY (id)
);










