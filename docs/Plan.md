## CRUD

Create  => Create a new resource => `POST`
Read    => Get a resource        => `GET` 
Update  => Change a resource     => `PUT`
Delete  => Remove a resource     => `DELETE`

## End Points

* Update URL: 
  * `post '/urls/:shortURL'`
  * redirects back to `'/urls/:shortURL'`
* Delete URL:
  * `post '/urls:shortURL/delete'` 
  * redirects back to `'/urls'`

## Tips

* Forms: Add a `name` to `input` attribute in order to retrieve form input values