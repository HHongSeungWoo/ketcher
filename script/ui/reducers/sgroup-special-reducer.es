import { mapOf } from '../component/form';
import { sgroupSpecial as sgroupSchema } from '../structschema.es'

const schemes = Object.keys(sgroupSchema).reduce((acc, title) => {
	acc[title] = mapOf(sgroupSchema[title], 'fieldName');
	return acc;
}, {});

const firstObjKey = obj => Object.keys(obj)[0];
const defaultContext = () => firstObjKey(schemes);
const defaultFieldName = context => firstObjKey(schemes[context]);
const defaultFieldValue = (context, fieldName) => schemes[context][fieldName].properties.fieldValue.default;

const initState = () => {
	const context = defaultContext();
	const fieldName = defaultFieldName(context);
	const fieldValue = defaultFieldValue(context, fieldName);

	return {
		stateForm: {
			context,
			fieldName,
			fieldValue,
			type: 'DAT'
		}
	}
};

export default function sgroupSpecialReducer(state = initState(), action) {
	if (action.type === 'UPDATE_SGROUPSPEC_FORM') {
		const name = firstObjKey(action.payload);

		switch (name) {
		case 'context':
			return onContextChange(state, action.payload[name]);
		case 'fieldName':
			return onFieldNameChange(state, action.payload[name]);
		default:
			return {
				...state,
				stateForm: Object.assign({}, state.stateForm, action.payload)
			};
		}
	}

	return state;
}

const onContextChange = (state, context) => {
	const fieldName = defaultFieldName(context);
	const fieldValue = defaultFieldValue(context, fieldName);

	return {
		...state,
		stateForm: {
			...state.stateForm,
			context,
			fieldName,
			fieldValue
		}
	}
};

const onFieldNameChange = (state, fieldName) => {
	const context = state.stateForm.context;
	const fieldValue = defaultFieldValue(context, fieldName);

	return {
		...state,
		stateForm: {
			...state.stateForm,
			fieldName,
			fieldValue
		}
	}
};
