import axios from 'axios';

// const baseURL = 'http://localhost/FleetCart/public/api';

const Backend = () => {
    const fetchData = () => {
        try {
          const res = axios.get(
            'https://multitoys2.nstekdev.com/api/product',
          );
          setData(res.data);
        } catch (error) {
          alert(error.toString());
        }
    }
}

export default Backend;