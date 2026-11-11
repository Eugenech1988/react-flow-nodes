import { screenshotFilename } from '../pipelines.helpers';

describe('screenshotFilename', () => {
  it('builds a unique filename keeping the original extension', () => {
    const callback = jest.fn();
    const file = { originalname: 'shot.png' } as Express.Multer.File;
    const req = {} as Express.Request;

    screenshotFilename(req, file, callback);

    expect(callback).toHaveBeenCalledWith(null, expect.stringMatching(/^\d+-\d+\.png$/));
  });

  it('keeps empty extension when originalname has none', () => {
    const callback = jest.fn();
    const file = { originalname: 'no-ext' } as Express.Multer.File;
    const req = {} as Express.Request;

    screenshotFilename(req, file, callback);

    expect(callback).toHaveBeenCalledWith(null, expect.stringMatching(/^\d+-\d+$/));
  });

  it('preserves compound extensions like .tar.gz', () => {
    const callback = jest.fn();
    const file = { originalname: 'archive.tar.gz' } as Express.Multer.File;
    const req = {} as Express.Request;

    screenshotFilename(req, file, callback);

    expect(callback).toHaveBeenCalledWith(null, expect.stringMatching(/^\d+-\d+\.gz$/));
  });
});
