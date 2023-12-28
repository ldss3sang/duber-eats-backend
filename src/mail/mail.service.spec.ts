import { Test } from '@nestjs/testing';
import got from 'got';
import * as FormData from 'form-data';
import { MailService } from './mail.service';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

jest.mock('got');
jest.mock('form-data');

const TEST_DOMAIN = 'test-domain';
const TEST_SUBJECT = 'Verify Your Email';
const TEST_TEMPLATE = 'verify-email';
const TEST_CODE = 'test-code';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test-apiKey',
            domain: TEST_DOMAIN,
            fromEmail: 'test-fromEmail',
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should call sendEmail', () => {
      const sendVerificationEmailArgs = {
        email: 'test@example.com',
        code: TEST_CODE,
      };
      jest.spyOn(service, 'sendMail').mockImplementation(async () => true);

      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );

      expect(service.sendMail).toHaveBeenCalledTimes(1);
      expect(service.sendMail).toHaveBeenCalledWith(
        TEST_SUBJECT,
        TEST_TEMPLATE,
        [
          { key: 'code', value: sendVerificationEmailArgs.code },
          { key: 'username', value: sendVerificationEmailArgs.email },
        ],
      );
    });
  });

  describe('sendEmail', () => {
    it('should send email', async () => {
      const result = await service.sendMail(TEST_SUBJECT, TEST_TEMPLATE, [
        { key: 'code', value: TEST_CODE },
      ]);
      const formSpy = jest.spyOn(FormData.prototype, 'append');
      expect(formSpy).toHaveBeenCalled();

      expect(got.post).toHaveBeenCalledTimes(1);
      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
        expect.any(Object),
      );

      expect(result).toEqual(true);
    });

    it('should fail on execption', async () => {
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });
      const result = await service.sendMail(TEST_SUBJECT, TEST_TEMPLATE, [
        {
          key: 'code',
          value: TEST_CODE,
        },
      ]);

      expect(result).toEqual(false);
    });
  });
});
