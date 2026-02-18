import { Notification } from '../domain/model/notification.model';
import { ListUserNotificationsUseCase } from './list-user-notifications.use-case';
import INotificationRepository from '../domain/repository/notification.repository';

describe('ListUserNotificationsUseCase', () => {
  const userId = 'user-1';
  const notifications = [
    new Notification({
      id: '1',
      userId,
      title: 'Title 1',
      message: 'Message 1',
      link: '/link-1',
    }),
    new Notification({
      id: '2',
      userId,
      title: 'Title 2',
      message: 'Message 2',
      link: '/link-2',
    }),
  ];

  const findMany = jest.fn().mockResolvedValue(notifications);
  const total = jest.fn().mockResolvedValue(notifications.length);

  const repository: INotificationRepository = {
    create: jest.fn(),
    findMany,
    total,
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const useCase = new ListUserNotificationsUseCase(repository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated notifications with total', async () => {
    const query = {
      skip: 0,
      take: 10,
    };

    const response = await useCase.execute(userId, query);

    expect(findMany).toHaveBeenCalledWith(userId, query.skip, query.take);
    expect(total).toHaveBeenCalledWith(userId);
    expect(response).toEqual({
      total: notifications.length,
      records: notifications,
    });
  });

  it('should call repository with correct skip and take values', async () => {
    const query = {
      skip: 5,
      take: 5,
    };

    await useCase.execute(userId, query);

    expect(findMany).toHaveBeenCalledWith(userId, 5, 5);
  });
});
