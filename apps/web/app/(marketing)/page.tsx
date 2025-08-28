import { BarberFeatures } from './_components/barber-features';
import { withI18n } from '~/lib/i18n/with-i18n';

function Home() {
  return (
    <div className={'mt-4 flex flex-col space-y-24 py-14'}>
      <BarberFeatures />
    </div>
  );
}

export default withI18n(Home);
