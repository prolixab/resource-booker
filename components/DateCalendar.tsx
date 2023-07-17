import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import Moment from 'moment';
import Datepicker from "tailwind-datepicker-react";
import DateTimePicker from 'react-tailwindcss-datetimepicker';

const options = {
	title: "Demo Title",
	autoHide: true,
	todayBtn: false,
	clearBtn: true,
	maxDate: new Date("2030-01-01"),
	minDate: new Date("1950-01-01"),
	theme: {
		background: "bg-gray-700 dark:bg-gray-800",
		todayBtn: "",
		clearBtn: "",
		icons: "",
		text: "",
		disabledText: "bg-red-500",
		input: "",
		inputIcon: "",
		selected: "",
	},
	icons: {
		// () => ReactElement | JSX.Element
		prev: () => <span>Previous</span>,
		next: () => <span>Next</span>,
	},
	datepickerClassNames: "top-12",
	defaultDate: new Date("2022-01-01"),
	language: "en",
}

export default function DateCalendar(props) {
	const [show, setShow] = useState < boolean >(false)
	const handleChange = (selectedDate: Date) => {
		console.log(selectedDate)
    props.setterFunction(selectedDate)
	}
	const handleClose = (state: boolean) => {
		setShow(state)
	}

	return (
		<div>
			<Datepicker options={options} onChange={handleChange} show={show} setShow={handleClose} />
		</div>
	)
}






