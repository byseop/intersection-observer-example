import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

type UserType = {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: number;
};

type UsersType = {
  data: UserType[];
  page: number;
  total_pages: number;
};

export default function Example() {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 1
  });
  const [users, setUsers] = useState<UsersType>();
  const [target, setTarget] = useState<Element | null>(null);

  const handleIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        setPageInfo((prev) => {
          if (prev.totalPage > prev.page) {
            console.log(123);
            return {
              ...prev,
              page: prev.page + 1
            };
          }
          return prev;
        });
      }
    },
    []
  );

  useEffect(() => {
    const instance = axios.get<UsersType>(
      `https://reqres.in/api/users?page=${pageInfo.page}`
    );
    instance.then((response) => {
      if (response.status === 200) {
        setUsers((prev) => {
          if (prev && prev.data?.length > 0) {
            return {
              ...response.data,
              data: [...prev.data, ...response.data.data]
            };
          }
          return response.data;
        });

        setPageInfo((prev) => ({
          ...prev,
          totalPage: response.data.total_pages
        }));
      }
    });
  }, [pageInfo.page]);

  useEffect(() => {
    let observer = new IntersectionObserver(handleIntersect, {
      threshold: 0,
      root: null
    });

    target && observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, target]);

  return (
    <div>
      <ul>
        {users?.data?.map((user, i) => (
          <li
            key={user.id}
            ref={users.data.length - 1 === i ? setTarget : null}
          >
            {user.first_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
