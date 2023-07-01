import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
    render(<IletisimFormu />);
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu />);

    const header = screen.getByText("İletişim Formu")
    
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu />);
    
    const name = screen.getByLabelText("Ad*");
    userEvent.type(name, "isim");

    const errorMessage = screen.getAllByTestId("error");
    expect(errorMessage).toHaveLength(1);
    //expect(errorMessage).toBeInTheDocument();
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);

    const submit = screen.getByText("Gönder");
    userEvent.click(submit);

    //const errorMessage = screen.getAllByTestId("error");
    //expect(errorMessage).toHaveLength(3);

    await waitFor(() => {
        const errorMessage = screen.queryAllByTestId("error");
        expect(errorMessage).toHaveLength(3);
    })
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);

    const name = screen.getByLabelText("Ad*");
    const surname = screen.getByLabelText("Soyad*");
    userEvent.type(name, "ornek");
    userEvent.type(surname, "soyadı");
    const buton = screen.getByRole("button");
    userEvent.click(buton);

    const errorMessage = screen.getAllByTestId("error");
    expect(errorMessage).toHaveLength(1);

});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu />);

    const mail = screen.getByLabelText(/Email*/i);
    userEvent.type(mail, "yanlış");
    
    const errorMessage = screen.getByTestId("error");
    expect(errorMessage).toHaveTextContent("email geçerli bir email adresi olmalıdır.");

    //const errorMessage = await screen.findByText(/email geçerli bir email adresi olmalıdır./i);
    //expect(errorMessage).toBeInTheDocument();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu />);

    const name = screen.getByLabelText("Ad*");
    const mail = screen.getByLabelText("Email*");
    const message = screen.getByLabelText("Mesaj");
    const buton = screen.getByRole("button");

    userEvent.type(name, "ornek");
    userEvent.type(mail, "ornek@test.com");
    userEvent.type(message, "mesaj");
    userEvent.click(buton);

    const errorMessage = screen.getByTestId("error");
    expect(errorMessage).toHaveTextContent("soyad gereklidir.");
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu />);

    const name = screen.getByLabelText("Ad*");
    const surname = screen.getByLabelText("Soyad*");
    const mail = screen.getByLabelText("Email*");
    const buton = screen.getByRole("button");

    userEvent.type(name, "ornek");
    userEvent.type(surname, "soyadı");
    userEvent.type(mail, "ornek@test.com");
    userEvent.click(buton);

    const ad = screen.queryByText("ornek");
    expect(ad).toBeInTheDocument();   
    const soyad = screen.queryByText("soyadı");
    expect(soyad).toBeInTheDocument();
    const email = screen.queryByText("ornek@test.com");
    expect(email).toBeInTheDocument();


    const message = screen.queryByTestId("messageDisplay");
    expect(message).not.toBeInTheDocument();
    
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu />);

    const name = screen.getByLabelText("Ad*");
    const surname = screen.getByLabelText("Soyad*");
    const mail = screen.getByLabelText("Email*");
    const message = screen.getByLabelText("Mesaj")
    const buton = screen.getByRole("button");

    userEvent.type(name, "ornek");
    userEvent.type(surname, "soyadı");
    userEvent.type(mail, "ornek@test.com");
    userEvent.type(message, "mesaj");
    userEvent.click(buton);

    await waitFor(() => {
        const name = screen.queryByTestId("firstnameDisplay");
        expect(name).toHaveTextContent("ornek");

        const surname = screen.queryByTestId("lastnameDisplay");
        expect(surname).toHaveTextContent("soyadı");
        
        const mail = screen.queryByTestId("emailDisplay");
        expect(mail).toHaveTextContent("ornek@test.com");

        const message = screen.queryByTestId("messageDisplay");
        expect(message).toHaveTextContent("mesaj");
    })

});