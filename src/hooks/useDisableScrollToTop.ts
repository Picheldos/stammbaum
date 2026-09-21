import { useEffect } from 'react';
import Router from 'next/router';

type NavMethod = (...args: unknown[]) => unknown;

/**
 * Отключает штатный «прыжок» страницы наверх при переходах между маршрутами.
 *
 * В Pages Router нет глобального флага для этого: Next скроллит окно в
 * начало на каждой навигации, а поведение управляется только опцией
 * `scroll` у `<Link>` и `router.push/replace`. Причём `<Link>` НЕ оставляет
 * её пустой, а всегда явно шлёт `scroll: true`, поэтому «дефолт при
 * отсутствии» не сработал бы. Здесь мы перехватываем сами методы.
 *
 * Все обёртки роутера (`useRouter()`, `makePublicRouterInstance` для
 * `<Link>`, статический синглтон `next/router`) делегируют одному и тому же
 * базовому инстансу `Router.router`. Патчим `push`/`replace` только у него —
 * это единственная точка, покрывающая ВСЕ навигации сразу.
 *
 * Особенно важно на этом проекте: старая страница остаётся видимой ~800 мс
 * во время анимации выхода (SwitchTransition), и без патча её содержимое
 * рывком уезжает вверх прямо на глазах у пользователя.
 *
 * Кнопки браузера «назад/вперёд» используют отдельный путь с `forcedScroll`
 * и не затрагиваются — восстановление позиции истории продолжает работать.
 */
const useDisableScrollToTop = (): void => {
    useEffect(() => {
        const instance = Router.router as unknown as
            | { push: NavMethod; replace: NavMethod }
            | null;
        if (!instance) return;

        const originalPush = instance.push.bind(instance);
        const originalReplace = instance.replace.bind(instance);

        const withoutScroll =
            (original: NavMethod): NavMethod =>
            (url, as, options) =>
                original(url, as, { ...(options as object), scroll: false });

        instance.push = withoutScroll(originalPush);
        instance.replace = withoutScroll(originalReplace);

        return () => {
            instance.push = originalPush;
            instance.replace = originalReplace;
        };
    }, []);
};

export default useDisableScrollToTop;
