--
-- PostgreSQL database dump
--

\restrict TpqF7HSQc9Fr61fivy2CHzd7zp7IW7xp7eK4tfYGtc1sRar9azwxEaJlsiLzODa

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
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: chuong
--

COPY public."User" (id, email, password, role, "adminId") FROM stdin;
1	user@example.com	password123	ADMIN	\N
2	chuongbgls@gmail.com	$2b$10$WJkvzcr7oG2wp55ZFqM5B.IAOxtaix67L8iVe2UFDJe.e7aIMxEWm	ADMIN	\N
5	employee@gmail.com	$2b$10$q8hgL.s4UTWbXQCZWcvjxePbOEULJ8Ncus1xizVMUVBwnfmvNA0Cu	EMPLOYEE	2
12	admin@gmail.com	$2b$10$SVOzawFw2aFDbzUxBBh8xO2sLevL/.CbJTYY4iyW/7HZykj6V5lIe	ADMIN	\N
13	ADMIN2@gmail.com	$2b$10$hhpNznBuI8YT.sQyaSg3qe9lAWaiG8vYxX70rsiqYEOvf//EaicNq	ADMIN	\N
15	EMPLOYEE2@gmail.com	$2b$10$NPUr3jrAt984Cb0hq5ySBOp8uE.NQVi.rSk5vEaz2rQ2ZCXfiLzVW	EMPLOYEE	13
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: chuong
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
54400275-6d4b-4a82-86d7-51fbbc3225af	b1ac646967154edcd5307c7146aac8677f418f29dd3e6fb29da3e6768879386e	2026-04-30 04:37:02.138054+00	20260430043702_init	\N	\N	2026-04-30 04:37:02.125938+00	1
\.


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chuong
--

SELECT pg_catalog.setval('public."User_id_seq"', 15, true);


--
-- PostgreSQL database dump complete
--

\unrestrict TpqF7HSQc9Fr61fivy2CHzd7zp7IW7xp7eK4tfYGtc1sRar9azwxEaJlsiLzODa

