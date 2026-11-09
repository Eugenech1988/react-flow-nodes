import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from '../blog.controller';
import { BlogService } from '../blog.service';

const mockBlogService = {
  findAll: jest.fn(),
  findOneBySlug: jest.fn(),
};

describe('BlogController (Public)', () => {
  let controller: BlogController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [{ provide: BlogService, useValue: mockBlogService }],
    }).compile();

    controller = module.get<BlogController>(BlogController);
  });

  describe('findAll', () => {
    it('delegates to blogService.findAll with locale', async () => {
      const posts = [{ id: 'post-1', slug: 'first-post' }];
      mockBlogService.findAll.mockResolvedValue(posts);

      const result = await controller.findAll('en');

      expect(mockBlogService.findAll).toHaveBeenCalledWith({ locale: 'en' });
      expect(result).toEqual(posts);
    });
  });

  describe('findOne', () => {
    it('delegates to blogService.findOneBySlug', async () => {
      const post = { id: 'post-1', slug: 'first-post' };
      mockBlogService.findOneBySlug.mockResolvedValue(post);

      const result = await controller.findOne('first-post', 'ua');

      expect(mockBlogService.findOneBySlug).toHaveBeenCalledWith('first-post', 'ua');
      expect(result).toEqual(post);
    });

    it('propagates errors from service', async () => {
      mockBlogService.findOneBySlug.mockRejectedValue(new Error('Not found'));
      await expect(controller.findOne('missing', 'en')).rejects.toThrow('Not found');
    });
  });
});
