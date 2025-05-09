import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid'; // Import the uuid library to generate unique IDs

// Define the form component
function Form(props) {
    // Initialize the state with taskTitle and user as empty strings
    const init = { taskTitle: '', user: '' };

    // Reducer function to manage form state updates
    const reducer = (state, action) => {
        switch (action.type) {
            // Reset state back to initial form values
            case 'reset':
                return init;
            // Update form field values in state when input changes
            case 'change':
                const { name, value } = action.element; // Destructure name and value from event target
                return { ...state, [name]: value }; // Update corresponding field in state
            // Return current state by default
            default:
                return state;
        }
    };

    // useReducer hook to manage form state and dispatch actions
    const [state, dispatch] = useReducer(reducer, init);
    const { taskTitle, user } = state; // Destructure state values for easier access

    const { getNewTask } = props; // Destructure getNewTask from props (used to send data to parent)

    // Form validation function to check if inputs meet the requirements
    const formValidation = (errors) => {
        if (taskTitle.length < 2) errors.push('Task name is required'); // Validate taskTitle
        if (user.length < 2) errors.push('Username is required'); // Validate user
    };

    // Handler for form submission
    const addTask = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Create a new task object with a unique ID and current input values
        const newTask = {
            id: uuid(),
            title: taskTitle,
            user: user,
            columnId: 1,
        };

        const errors = []; // Initialize an array to store any validation errors
        formValidation(errors); // Run form validation

        // If no validation errors, pass newTask to the parent component and reset the form
        if (errors.length === 0) {
            getNewTask(newTask); // Call the function to send new task data to the parent component
            dispatch({ type: 'reset' }); // Reset form fields
        } else {
            alert(errors.join(',\n')); // If errors exist, alert the user with the error messages
        }
    };

    // Render the form
    return (
        <form className='form' onSubmit={addTask}>
            <div className='form__container'>
                <label>
                    <input
                        name='taskTitle' // Input field for task title
                        value={taskTitle}
                        type='text'
                        onChange={(e) => dispatch({ type: 'change', element: e.target })} // Dispatch 'change' action on input change
                        placeholder='task title...'
                        required
                    />
                </label>
                <label>
                    <input
                        name='user' // Input field for user name
                        value={user}
                        type='text'
                        onChange={(e) => dispatch({ type: 'change', element: e.target })} // Dispatch 'change' action on input change
                        placeholder='user name...'
                        required
                        pattern='^[a-zA-Z -]+$' // Validate username with letters and spaces only
                    />
                </label>
                <input type='submit' value='add' className='form__submit' /> {/* Submit button */}
            </div>
        </form>
    );
}

// Define the prop types to ensure the getNewTask prop is a required function
Form.propTypes = {
    getNewTask: PropTypes.func.isRequired,
};

export default Form; // Export the Form component for use in other parts of the application
