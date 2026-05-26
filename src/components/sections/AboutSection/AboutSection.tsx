import React from 'react';
import { AboutBlock } from '@/components/blocks/AboutBlock/AboutBlock';
// import familyImage from '/images/family.jpg'; // ← проверь путь

import { Container, FlexContainer } from './AboutSection.styled';

export const AboutSection: React.FC = () => {
  return (
    <Container>
      <h1>О проекте</h1>

      <FlexContainer>
        {/* Шаг 1 */}
        <AboutBlock
          variant="step"
          stepNumber={1}
          title="Зарегистрируйтесь и начните создавать свою историю"
          popupTitle="Шаг 1"
          popupContent="После входа вы можете добавить сведения о близких, загрузить фотографии, памятные моменты, отмечать важные даты и выстраивать структуру семейных связей."
        />

        {/* Центральное фото */}
        {/* <AboutBlock
          variant="image"
          image={familyImage}
        /> */}

        {/* Шаг 2 */}
        <AboutBlock
          variant="step"
          stepNumber={2}
          title="Добавляйте родственников и объединяйте ваши семейные древа"
          popupTitle="Шаг 2"
          popupContent="Приглашайте членов семьи, объединяйте несколько древ в одно большое генеалогическое дерево."
        />

        {/* Шаг 3 */}
        <AboutBlock
          variant="step"
          stepNumber={3}
          title="Вы получаете общую картину вашего семейного древа"
          popupTitle="Шаг 3"
          popupContent="Просматривайте полную структуру семьи, связи между поколениями и важные события в удобном визуальном формате."
        />

        {/* Шаг 4 */}
        <AboutBlock
          variant="step"
          stepNumber={4}
          title="Добавляйте данные о своих усопших родственниках"
          popupTitle="Шаг 4"
          popupContent="Сохраняйте память о предках: даты жизни, биографии, фотографии и истории."
        />
      </FlexContainer>
    </Container>
  );
};