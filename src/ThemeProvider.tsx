import { FC, ReactNode, useEffect } from 'react';
import { Theme, ThemeOptions } from '@radix-ui/themes';

// Define the type for the props
interface ThemeProviderProps extends Partial<ThemeOptions> {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...rest }) => {
  useEffect(() => {
    switch (rest.appearance) {
      case 'light': {
        if (document?.body) {
          document.body.classList.remove('light', 'dark');
          document.body.classList.add('light');
        }
        break;
      }
      case 'dark': {
        if (document?.body) {
          document.body.classList.remove('light', 'dark');
          document.body.classList.add('dark');
        }
        break;
      }
      default: {
        // You might want to handle the default case
      }
    }
  }, [rest.appearance]);

  return <Theme {...rest}>{children}</Theme>;
};
