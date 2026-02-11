/**
 * Email Service
 * Handles sending emails to professionals and patients
 * TODO: Integrate with a real email service (SendGrid, Resend, etc.)
 */

export interface EmailCredentials {
  email: string;
  password: string;
  name: string;
}

export async function sendProfessionalCredentialsEmail(credentials: EmailCredentials) {
  try {
    // For now, this logs to console and could be expanded to use a real service
    
    const emailContent = {
      to: credentials.email,
      subject: 'Suas credenciais de acesso foram criadas',
      body: `
Olá ${credentials.name},

Bem-vindo ao sistema de agendamento da clínica!

Suas credenciais de acesso foram criadas:
- Email: ${credentials.email}
- Senha: ${credentials.password}

Acesse o sistema em: ${getAppUrl()}

Por favor, altere sua senha no primeiro acesso.

Atenciosamente,
Sistema de Agendamento da Clínica
      `.trim(),
    };

    // Log for development/demo
    console.log('📧 Email a ser enviado:', emailContent);

    // TODO: Integrate with real email service
    // Example with Resend:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${RESEND_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     from: 'clinica@example.com',
    //     to: credentials.email,
    //     subject: emailContent.subject,
    //     html: formatEmailAsHtml(emailContent.body),
    //   }),
    // });

    return {
      success: true,
      message: `Email enviado para ${credentials.email}`,
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return {
      success: false,
      message: 'Erro ao enviar email, mas o profissional foi cadastrado',
      error,
    };
  }
}

export function getAppUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:5173'; // Vite default
}

/**
 * Format email body as HTML for rich email
 */
function formatEmailAsHtml(text: string): string {
  const lines = text.split('\n');
  const htmlLines = lines.map((line) => {
    if (line.trim() === '') return '<br/>';
    if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
    return `<p>${line}</p>`;
  });
  return `<html><body>${htmlLines.join('')}</body></html>`;
}

/**
 * Send appointment confirmation email
 */
export async function sendAppointmentConfirmationEmail(
  professionalEmail: string,
  patientEmail: string,
  appointmentDetails: any
) {
  try {
    const message = `
Consulta agendada com sucesso!

Detalhes:
- Data: ${appointmentDetails.date}
- Horário: ${appointmentDetails.startTime}
- Duração: ${appointmentDetails.duration} minutos
- Profissional: ${appointmentDetails.professionalName}
- Serviço: ${appointmentDetails.serviceName}
    `.trim();

    console.log('📧 Email de confirmação de consulta:', message);

    return {
      success: true,
      message: 'Email de confirmação enviado',
    };
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
    return {
      success: false,
      message: 'Erro ao enviar email de confirmação',
      error,
    };
  }
}
