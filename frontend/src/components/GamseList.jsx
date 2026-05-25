import { useQuery } from '@apollo/client';
import {GET_GAMES} from '../queries'


function UserList() {
  const { loading, error, data } = useQuery(GET_GAMES); //
 if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Абракадабра</h2>
      <ul>
        {data.name}
      </ul>
    </div>
  );
}

export default UserList;