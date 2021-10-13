import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    paddingBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#162d4d',
  },
  heading: {
    color: '#162d4d',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 30,
    paddingRight: 20,
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  linkButton: {
    backgroundColor: "#6bc7b8",
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
    borderRadius: 50,
    padding: 20,
   },
  container: {
    flex: 1,
    padding: 20,
  },
  rowContainer: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  rowButton:{
    width: 200,
    color: 'red',
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 20,
    padding: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    marginBottom: 10,
    borderRadius: 6,
  },
  button: {
    marginBottom: 10,
    borderRadius: 6,
    padding: 10,
  },
  modalContent: {

  },
  errorText: {
    color: 'crimson',
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 2,
    textAlign: 'center',
  }
});