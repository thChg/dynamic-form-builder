--
-- PostgreSQL database dump
--

\restrict MMjrYAmQrYYRHEn82TzwkJAFnKeLd1CW4v8JvHVw7Jg5LPb49uFFOtwYz1PpZjM

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Form; Type: TABLE DATA; Schema: public; Owner: chuong
--

COPY public."Form" (id, title, description, "order", status, "ownerId") FROM stdin;
3	full test	Thân chào bạn Hoàng Thiên Trường,\n\nTopCV cảm ơn bạn đã quan tâm đến chương trình Next Gen 2026 của chúng tôi. Chúng tôi rất vui mừng thông báo bạn đã vượt qua vòng xét duyệt hồ sơ và muốn gửi đến bạn bài đánh giá năng lực như bên dưới.	0	PUBLISHED	2
4	test	test	1	PUBLISHED	2
\.


--
-- Data for Name: Field; Type: TABLE DATA; Schema: public; Owner: chuong
--

COPY public."Field" (id, label, type, conditions, "order", "formId") FROM stdin;
13	text	text	{"0": "maxLength", "1": 199, "required": true, "maxLength": 60}	0	3
14	num	number	{"0": "maxNumber", "1": 15, "required": true, "maxNumber": 90}	1	3
15	email	email	{"required": true}	2	3
16	date	date	{"0": "0", "1": "2026-05-03", "maxDate": "2026-05-22T00:00:00.000Z", "minDate": "2026-05-01T00:00:00.000Z", "required": true}	3	3
17	color	color	{"0": "0", "1": true, "required": true}	4	3
18	select	select	{"0": "0", "1": "[\\"option 1\\", \\"option 2\\", \\"option 3\\"]", "options": "[\\"option 1\\", \\"option 2\\", \\"option 3\\"]", "required": false}	5	3
19	text label	text	{"required": true, "maxLength": 30}	0	4
20	num label	number	{"minNumber": 1}	1	4
21	email label	email	{"required": true}	2	4
22	date label	date	{"minDate": "2026-05-16T00:00:00.000Z"}	3	4
23	color label	color	{"required": true}	4	4
24	select label	select	{"options": "[\\"1\\", \\"2\\", \\"3\\"]", "required": true}	5	4
\.


--
-- Data for Name: Submission; Type: TABLE DATA; Schema: public; Owner: chuong
--

COPY public."Submission" (id, "formId", "createdAt") FROM stdin;
2	4	2026-05-02 19:58:19.653
\.


--
-- Data for Name: FieldResponse; Type: TABLE DATA; Schema: public; Owner: chuong
--

COPY public."FieldResponse" (id, "submissionId", "fieldId", value) FROM stdin;
7	2	19	hi
8	2	20	19
9	2	21	truongbgls2004@gmail.com
10	2	22	3344-03-22
11	2	23	#3a0e0e
12	2	24	1
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: chuong
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
b8839764-b487-423a-bf1f-55df1f2e1ac1	b67f25dcc4c9f5bf1fc9bc59e8079f065f253bd247ad2022827fc9c64cbdd07c	2026-05-02 19:34:20.5614+00	20260430054848_init	\N	\N	2026-05-02 19:34:20.528911+00	1
\.


--
-- Name: FieldResponse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chuong
--

SELECT pg_catalog.setval('public."FieldResponse_id_seq"', 16, true);


--
-- Name: Field_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chuong
--

SELECT pg_catalog.setval('public."Field_id_seq"', 33, true);


--
-- Name: Form_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chuong
--

SELECT pg_catalog.setval('public."Form_id_seq"', 7, true);


--
-- Name: Submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chuong
--

SELECT pg_catalog.setval('public."Submission_id_seq"', 3, true);


--
-- PostgreSQL database dump complete
--

\unrestrict MMjrYAmQrYYRHEn82TzwkJAFnKeLd1CW4v8JvHVw7Jg5LPb49uFFOtwYz1PpZjM

