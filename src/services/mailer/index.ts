import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
  type SendMailOptions,
  type Transporter,
} from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'

import { mailConfig, mailgunConfig } from '@/config/mail'

export interface ISendOptions extends SendMailOptions {
  template?: string
  context?: Record<string, string>
}

export class Mailer {
  private static transporter: Transporter

  private static async setup() {
    if (process.env.NODE_ENV !== 'production') {
      await Mailer.setupDevelopmentAccount()
    } else {
      Mailer.setupMailgunAccount()
    }
  }

  public static async send(data: ISendOptions) {
    await Mailer.setup()

    data.from = `${mailConfig.fromName} <${mailConfig.fromAddress}>`

    const info = await Mailer.transporter.sendMail(data)
    console.info('Message sent: %s', info.messageId)

    // Preview only available when sending through an Ethereal account
    if (process.env.NODE_ENV !== 'production') {
      console.info('Preview URL: %s', getTestMessageUrl(info))
    }
  }

  private static async setupDevelopmentAccount() {
    const testAccount = await createTestAccount()
    Mailer.transporter = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  }

  private static setupMailgunAccount() {
    Mailer.transporter = createTransport(
      mg({
        auth: {
          api_key: mailgunConfig.apiKey,
          domain: mailgunConfig.domain,
        },
      }),
    )
  }
}
