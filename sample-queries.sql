CREATE TABLE ACTOR
(
	ACT_ID varchar(3),
	ACT_NAME VARCHAR(20),
	ACT_GENDER CHAR(1),
	CONSTRAINT PKAC PRIMARY KEY(ACT_ID)
);

INSERT INTO ACTOR VALUES(001,'Sudeep','M');
INSERT INTO ACTOR VALUES(002,'Shradda kapoor','F');
INSERT INTO ACTOR VALUES(003,'Jacqueline Fernandez','F');
INSERT INTO ACTOR VALUES(004,'Darshan','M');
INSERT INTO ACTOR VALUES(005,'Yash','M');
INSERT INTO ACTOR VALUES(006,'Tom Cruise','M');
INSERT INTO ACTOR VALUES(007,'Puneeth','M');

SELECT * FROM ACTOR;

DROP table ACTOR;