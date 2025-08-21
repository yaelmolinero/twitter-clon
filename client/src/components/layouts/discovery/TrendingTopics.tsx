interface TrendingType {
  category: string;
  title: string;
  tweets: string | number;
}

const TOPICS_MOCK: TrendingType[] = [
  {
    category: 'Entretenimiento',
    title: '#MeCompilaPeroNoFunciona',
    tweets: '1.031'
  },
  {
    category: 'Programación',
    title: '#FalaUnPuntoYComa',
    tweets: '32,2 mil'
  },
  {
    category: 'Aviso',
    title: 'No son datos reales',
    tweets: '1'
  }
];

function TrendingTopics() {
  return (
    <div className="border-1 border-borderColor rounded-2xl *:px-4 *:py-3 leading-5">
      <div>
        <h2 className="text-primary text-xl font-bold">Qué está pasando</h2>
      </div>
      {
        TOPICS_MOCK.map(({ category, title, tweets }, index) => (
          <div className="cursor-pointer hover:bg-hoverColor" key={index}>
            <div className="text-secondary text-sm">
              <span className="">{category}</span>
            </div>

            <div className="text-primary font-bold">
              <span>{title}</span>
            </div>

            <div className="text-secondary text-sm">
              <span>{tweets} publicaciones</span>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default TrendingTopics;