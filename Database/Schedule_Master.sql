CREATE TABLE public.users
(
	id serial not null,
	name character varying(30) not null,
	email character varying(30) not null,
	password character varying(20) not null
);

CREATE TABLE public.schedules
(
	id serial not null,
	title character varying(20) not null,
	columns int not null default 1 CHECK (columns BETWEEN 1 AND 7),
	user_id int not null
);

CREATE TABLE public.columns
(
	id serial not null,
	title character varying(20) not null,
	slots int not null default 24,
	schedule_id int not null
);

CREATE TABLE public.tasks
(
	id serial not null,
	title character varying(20) not null,
	content text not null
);

CREATE TABLE public.slots
(
	id serial not null,
	column_id int not null,
	hour_value int not null,
	task_id int not null
);

--ADD PRIMARY KEY...........................................................................................
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);
	
ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);
	
ALTER TABLE ONLY public.slots
    ADD CONSTRAINT slots_pkey PRIMARY KEY (id);
	
--ADD FOREIGN KEY...........................................................................................
ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
	
ALTER TABLE ONLY public.columns
    ADD CONSTRAINT schedule_id FOREIGN KEY (schedule_id) REFERENCES public.schedule(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.slots
    ADD CONSTRAINT column_id FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.slots
    ADD CONSTRAINT task_id FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;