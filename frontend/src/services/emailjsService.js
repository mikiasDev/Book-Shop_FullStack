import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_25zx8td';
const TEMPLATE_ID = 'template_b688onm';
const PUBLIC_KEY = '47zawTEGkKZQcxRkh';

export const sendContactEmail = async (formData) => {
  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject || 'Contact Form',
    message: formData.message,
    phone: formData.phone || '',
    department: formData.department || '',
    to_email: 'mikiasmulu93@gmail.com',
  };
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
};
