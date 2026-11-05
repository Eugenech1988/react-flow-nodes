import { actions } from 'astro:actions';
import { navigate } from 'astro:transitions/client';

export function initDemoForm() {
  document.addEventListener('astro:page-load', () => {
    const form = document.querySelector('#demo-form') as HTMLFormElement;
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      form.querySelectorAll('.custom-input').forEach((el) => el.classList.remove('is-invalid'));
      form.querySelectorAll('.error-message').forEach((el) => {
        el.textContent = '';
        el.classList.add('hidden');
      });

      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Scheduling...';
      }

      const formData = new FormData(form);

      const { error } = await actions.mail.requestDemo(formData);

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Schedule Demo';
      }

      if (error) {
        if (error.code === 'BAD_REQUEST' && error.fields) {
          const fieldErrors = error.fields as Record<string, string[]>;

          Object.entries(fieldErrors).forEach(([fieldName, messages]) => {
            const input = form.querySelector(`[name="${fieldName}"]`) as HTMLElement;
            const errorMessage = form.querySelector(`[data-error="${fieldName}"]`);

            if (input) input.classList.add('is-invalid');
            if (errorMessage && messages?.[0]) {
              errorMessage.textContent = messages[0];
              errorMessage.classList.remove('hidden');
            }
          });
          return;
        }

        alert(error.message || 'Something went wrong. Please try again.');
        return;
      }

      navigate('/');
    });

    form.querySelectorAll('[required], input, select, textarea').forEach((input) => {
      input.addEventListener('input', () => {
        const htmlInput = input as HTMLElement;
        htmlInput.classList.remove('is-invalid');
        const fieldName = htmlInput.getAttribute('name');
        if (fieldName) {
          const errorMessage = form.querySelector(`[data-error="${fieldName}"]`);
          if (errorMessage) {
            errorMessage.classList.add('hidden');
          }
        }
      });
    });
  });
}
