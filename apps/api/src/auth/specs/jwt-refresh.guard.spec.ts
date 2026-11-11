import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { AuthGuard } from '@nestjs/passport';

describe('JwtRefreshGuard', () => {
  it('should be defined', () => {
    const guard = new JwtRefreshGuard();
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with jwt-refresh strategy', () => {
    const guard = new JwtRefreshGuard();
    expect(guard).toBeInstanceOf(AuthGuard('jwt-refresh'));
  });
});
