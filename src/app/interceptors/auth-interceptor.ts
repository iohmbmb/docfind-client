import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Attempt to grab your cryptographically signed JWT string from the browser cache
  const token = localStorage.getItem('healthcare_jwt');

  // If a session token is active, securely clone the request and inject the Bearer header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Pass the modified request down the pipeline
    return next(clonedRequest);
  }

  // If no token exists (like during Login or Register), forward the original request untouched
  return next(req);
};
