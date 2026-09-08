import { FaqsService } from './faqs.service';

describe('FaqsService', () => {
  let service: FaqsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      fAQ: {
        create: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    service = new FaqsService(prisma);
  });

  it('applies page and service filters for public FAQs', async () => {
    await service.findAllPublic({ page: 'HOME', serviceId: 'service-1' } as any);

    expect(prisma.fAQ.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'Active',
          page: 'HOME',
          serviceId: 'service-1',
        }),
      }),
    );
  });
});
