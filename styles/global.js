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
    backgroundColor: "#D3D3D3",
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
    borderColor: '#000000',
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
  },
  notifavatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  listingItem: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  descriptionItem: {
    color: "white",
  },
  headerContent: {
    padding: 30,
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "600",
  },
  userInfo: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
  },
  header: {
    ...Platform.select({
      ios: {
        backgroundColor: "#2B7D9C",
      },
      android: {
        backgroundColor: "#DCDCDC",
      },
    }),
  },

});