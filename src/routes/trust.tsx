import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/trust")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Доверие и безопасность — Профориентация" },
      {
        name: "description",
        content:
          "Как мы храним ваши данные, какие средства защиты используем и как с нами связаться по вопросам безопасности и приватности.",
      },
      { property: "og:title", content: "Доверие и безопасность" },
      {
        property: "og:description",
        content:
          "Как мы храним ваши данные, какие средства защиты используем и как с нами связаться по вопросам безопасности и приватности.",
      },
    ],
  }),
  component: TrustPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border-2 border-[#0B2545] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#0B2545]">
      <h2 className="text-2xl font-extrabold text-[#0B2545] mb-3">{title}</h2>
      <div className="space-y-3 text-[#0B2545]/90 leading-relaxed">{children}</div>
    </section>
  );
}

function TrustPage() {
  return (
    <div className="min-h-screen px-4 py-12 sm:py-16 bg-[#FFF7EE] text-[#0B2545]">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B2545]/70 hover:text-[#0B2545]"
          >
            ← На главную
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Доверие и безопасность
          </h1>
          <p className="text-lg text-[#0B2545]/80">
            Эта страница ведётся владельцем приложения «Профориентация» и отвечает на
            частые вопросы о безопасности и приватности. Это не сертификация и не
            независимая проверка.
          </p>
        </header>

        <Section title="Что это за приложение">
          <p>
            «Профориентация» — мини-тест, который помогает определить подходящее
            направление обучения. Пользователь регистрируется, отвечает на вопросы и
            получает результат. Ответы и итог сохраняются в учётной записи
            пользователя.
          </p>
        </Section>

        <Section title="Аутентификация и доступ">
          <ul className="list-disc pl-5 space-y-2">
            <li>Вход выполняется по email и паролю через Supabase Auth.</li>
            <li>
              Доступ к данным защищён правилами доступа на уровне строк (RLS): каждый
              пользователь видит только свои ответы и результаты.
            </li>
            <li>
              Серверные операции выполняются только для аутентифицированных
              пользователей.
            </li>
          </ul>
        </Section>

        <Section title="Какие данные мы собираем">
          <ul className="list-disc pl-5 space-y-2">
            <li>Email — для входа и идентификации учётной записи.</li>
            <li>Ответы на вопросы теста и рассчитанный результат направления.</li>
            <li>
              Технические метаданные (время прохождения теста), необходимые для работы
              сервиса.
            </li>
          </ul>
          <p>
            Мы не запрашиваем платёжные данные, не используем рекламные трекеры и не
            продаём данные третьим лицам.
          </p>
        </Section>

        <Section title="Где хранятся данные">
          <p>
            Приложение использует инфраструктуру Lovable Cloud на базе Supabase для
            хранения учётных записей, ответов и результатов. Соединение с базой
            защищено TLS, доступ к данным контролируется политиками RLS.
          </p>
        </Section>

        <Section title="Хранение и удаление">
          <p>
            Данные хранятся, пока существует учётная запись. Если вы хотите удалить
            свою учётную запись и связанные с ней данные, напишите владельцу
            приложения по контактам ниже.
          </p>
        </Section>

        <Section title="Сторонние сервисы">
          <ul className="list-disc pl-5 space-y-2">
            <li>Supabase — аутентификация и база данных.</li>
            <li>Lovable — хостинг и доставка приложения.</li>
          </ul>
        </Section>

        <Section title="Сообщить об уязвимости">
          <p>
            Если вы обнаружили проблему безопасности, пожалуйста, свяжитесь с
            владельцем приложения. Мы постараемся ответить как можно быстрее. Не
            публикуйте детали уязвимости публично до её устранения.
          </p>
        </Section>

        <footer className="text-sm text-[#0B2545]/60 pt-4">
          Страница носит информационный характер и может обновляться по мере развития
          приложения.
        </footer>
      </div>
    </div>
  );
}
