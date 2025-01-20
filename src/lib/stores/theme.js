import { writable } from 'svelte/store';

function createThemeStore() {
    // Initialize the store with system preference or stored value
    const prefersDark = typeof window !== 'undefined' && 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = typeof localStorage !== 'undefined' && 
        localStorage.getItem('theme');
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    
    const { subscribe, set, update } = writable(initialTheme);

    // Apply the initial theme immediately if we're in the browser
    if (typeof window !== 'undefined') {
        if (initialTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }

    return {
        subscribe,
        /**
         * Toggle the theme between light and dark.
         */
        toggle: () => update(/** @type {"light" | "dark"} */theme => {
            const newTheme = theme === 'light' ? 'dark' : 'light';
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', newTheme);
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            return newTheme;
        }),
        /**
         * @param {"light" | "dark"} value
         */
        set: (value) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', value);
                if (value === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            set(value);
        }
    };
}

export const theme = createThemeStore();
