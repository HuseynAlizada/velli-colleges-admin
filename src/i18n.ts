import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'


i18n.use(initReactI18next).init({
    debug: true,
    fallbackLng: "en",
    resources: {
        en: {
            translation: {
                title: 'Login to Family School Portal',
                description: "Welcome back! Please log in to continue",
                email: "Email",
                emailText: "Please enter your email",
                password: "Password",
                passwordText: "Please enter your password",
                login: "Login",
                forgotPassword: "Forgot Password?"
            }
        },
        az: {
            translation: {
                title: 'Ailə Məktəbi Portalına daxil olun',
                description: 'Yenidən xoş gəlmisiniz! Davam etmək üçün daxil olun',
                email: "E-poçt",
                emailText: "Zəhmət olmasa e-poçtunuzu daxil edin",
                password: "Şifrə",
                passwordText: "Zəhmət olmasa parolunuzu daxil edin",
                login: "Daxil ol",
                forgotPassword: "Şifrəni unutmusunuz?"
            }
        },
        ru: {
            translation: {
                title: 'Войти в Семейный школьный портал',
                description: 'Добро пожаловать обратно! Пожалуйста, войдите, чтобы продолжить',
                email: "Электронная почта",
                emailText: "Пожалуйста, введите адрес электронной почты",
                password: 'Пароль',
                passwordText: 'Пожалуйста, введите ваш пароль',
                login: "Войти",
                forgotPassword: "Забыли пароль?"

            }
        }
    }

})

export default i18n