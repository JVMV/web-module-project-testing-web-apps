import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

let fname, lname, email, message, submitButton
beforeEach(() => {
    render(<ContactForm />)
    submitButton = screen.queryByText('Submit')
    fname = screen.queryByPlaceholderText('Edd')
    lname = screen.queryByPlaceholderText('Burke')
    email = screen.queryByPlaceholderText('bluebill1049@hotmail.com')
    message = screen.queryByLabelText('Message')
})

test('renders without errors', () => { //initial && sanity
    const err = screen.queryByTestId('error')
    expect(fname).toHaveValue('')
    expect(lname).toHaveValue('')
    expect(email).toHaveValue('')
    expect(message).toHaveValue('')
    expect(err).toBeNull()
});

test('renders the contact form header', () => {
    const form = screen.getByText('Contact Form')
    expect(form).toBeVisible()
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    const nameInput = screen.getByPlaceholderText('Edd')
    fireEvent.change(nameInput, {target: { value: 'John' }})
    screen.getByText('Error: firstName must have at least 5 characters.')
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    fireEvent.click(submitButton)
    screen.getByText('Error: firstName must have at least 5 characters.')
    screen.getByText('Error: lastName is a required field.')
    screen.getByText('Error: email must be a valid email address.')
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    fireEvent.change(fname, {target: { value: 'Justin' }})
    fireEvent.change(lname, {target: { value: 'Abellera' }})
    fireEvent.click(submitButton)
    screen.getByText('Error: email must be a valid email address.')
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    fireEvent.change(email, {target: { value: 'not a valid email' }})
    screen.getByText('Error: email must be a valid email address.')
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    fireEvent.change(fname, {target: { value: 'Justin' }})
    fireEvent.change(email, {target: { value: 'email@email.com' }})
    fireEvent.click(submitButton)
    screen.getByText('Error: lastName is a required field.')
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    fireEvent.change(fname, {target: { value: 'Justin' }})
    fireEvent.change(lname, {target: { value: 'Abellera' }})
    fireEvent.change(email, {target: { value: 'email@email.com' }})
    fireEvent.click(submitButton)
    expect(screen.queryByText('You Submitted:')).toBeVisible()
    expect(screen.queryByTestId('messageDisplay')).toBeNull()
});

test('renders all fields text when all fields are submitted.', async () => {
    fireEvent.change(fname, {target: { value: 'Justin' }})
    fireEvent.change(lname, {target: { value: 'Abellera' }})
    fireEvent.change(email, {target: { value: 'email@email.com' }})
    fireEvent.change(message, {target: { value: 'if a tree fell in the middle of nowhere, how confusing would this sentence be?' }})
    fireEvent.click(submitButton)
    expect(screen.queryByTestId('firstnameDisplay')).toBeVisible()
    expect(screen.queryByTestId('lastnameDisplay')).toBeVisible()
    expect(screen.queryByTestId('emailDisplay')).toBeVisible()
    expect(screen.queryByTestId('messageDisplay')).toBeVisible()
});
