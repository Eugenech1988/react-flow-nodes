import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { AppInput, AppTextarea, AppLabel } from './FormControls';

vi.mock('@pipeline/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

vi.mock('@pipeline/ui/textarea', () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}));

vi.mock('@pipeline/ui/label', () => ({
  Label: (props: React.LabelHTMLAttributes<HTMLLabelElement>) => <label {...props} />,
}));

describe('FormControls', () => {
  describe('AppInput', () => {
    it('renders input with placeholder', () => {
      render(<AppInput placeholder="Enter name" />);
      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    });

    it('applies theme-specific classes for careers', () => {
      render(<AppInput theme="careers" placeholder="x" />);
      const input = screen.getByPlaceholderText('x');
      expect(input).toHaveClass('font-typewriter');
      expect(input).toHaveClass('rounded-sm');
    });

    it('applies error classes when error=true', () => {
      render(<AppInput error placeholder="x" />);
      const input = screen.getByPlaceholderText('x');
      expect(input).toHaveClass('border-theme-danger');
      expect(input).toHaveClass('text-theme-danger');
    });

    it('does not apply error classes when error=false', () => {
      render(<AppInput placeholder="x" />);
      const input = screen.getByPlaceholderText('x');
      expect(input).not.toHaveClass('border-theme-danger');
    });

    it('forwards native input props', () => {
      const onChange = vi.fn();
      render(<AppInput type="email" onChange={onChange} placeholder="x" />);
      const input = screen.getByPlaceholderText('x') as HTMLInputElement;
      expect(input.type).toBe('email');
    });
  });

  describe('AppTextarea', () => {
    it('renders textarea', () => {
      render(<AppTextarea placeholder="Message" />);
      expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
    });

    it('applies careers theme classes', () => {
      render(<AppTextarea theme="careers" placeholder="x" />);
      expect(screen.getByPlaceholderText('x')).toHaveClass('font-typewriter');
    });

    it('applies error classes', () => {
      render(<AppTextarea error placeholder="x" />);
      expect(screen.getByPlaceholderText('x')).toHaveClass('border-theme-danger');
    });
  });

  describe('AppLabel', () => {
    it('renders label content', () => {
      render(<AppLabel>Field</AppLabel>);
      expect(screen.getByText('Field')).toBeInTheDocument();
    });

    it('applies font-typewriter for careers theme', () => {
      render(<AppLabel theme="careers">Field</AppLabel>);
      expect(screen.getByText('Field')).toHaveClass('font-typewriter');
    });

    describe('AppInput blog theme', () => {
      it('applies font-mono + rounded-sm for blog', () => {
        render(<AppInput theme="blog" placeholder="x" />);
        const input = screen.getByPlaceholderText('x');
        expect(input).toHaveClass('font-mono');
        expect(input).toHaveClass('rounded-sm');
        expect(input).toHaveClass('h-10');
      });
    });

    describe('AppTextarea blog theme', () => {
      it('applies font-mono + rounded-sm for blog', () => {
        render(<AppTextarea theme="blog" placeholder="x" />);
        const textarea = screen.getByPlaceholderText('x');
        expect(textarea).toHaveClass('font-mono');
        expect(textarea).toHaveClass('rounded-sm');
      });
    });

    describe('AppLabel blog theme', () => {
      it('applies font-mono for blog', () => {
        render(<AppLabel theme="blog">Field</AppLabel>);
        expect(screen.getByText('Field')).toHaveClass('font-mono');
      });
    });

    it('applies font-mono for blog theme', () => {
      render(<AppLabel theme="blog">Field</AppLabel>);
      expect(screen.getByText('Field')).toHaveClass('font-mono');
    });
  });
});
