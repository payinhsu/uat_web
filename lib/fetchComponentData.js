export default function fetchComponentData(dispatch, components, params) {
	console.log('location params ==========');
	console.log(JSON.stringify(params));
	console.log('location params ##########');

  const needs = components.reduce( (prev, current) => {

    return current ? (current.needs || []).concat(prev) : prev;
  }, []);

  const promises = needs.map(need => dispatch(need(params)));

  return Promise.all(promises);
}
