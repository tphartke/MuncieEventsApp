import { StyleSheet} from "react-native"

export default StyleSheet.create({
    title: {
        textAlign:"center",
        fontSize:30,
        fontWeight:"bold",
        color:'#cb532b',
    },

    menuIcon:{
        zIndex: 9,
        left: 10,
        top: 20,
        alignItems: 'flex-start',
        position: 'absolute'

    },

    centeredSingleItemText: {
        flexDirection:"row", 
        alignItems:"center", 
        justifyContent: "center",
        textAlign: "center",
    },
    

    content: {
        paddingTop: 5,
        marginHorizontal: 5
    },

    mainViewContent:{
        flex:1,
    },

    widgetContent: {
        padding: 10,
        fontSize: 16        
    },

    eventList: {
        flex: 1,
        flexBasis: '100%',
    },

    expandedView: {
        flex: 1,
        flexBasis: '100%',
    },

    advancedSearchResults: {
        flex: 1,
        flexBasis: '84%'
    },
    
    GoToDateSearchResults: {
        flex: 1,
        flexBasis: '84%',
    },

    searchResults: {
        flex: 1,
        flexBasis: '84%',
    },

    profileViewEvents: {
        flex: 1,
        flexBasis: '30%'
    },

    mailingListScrollView: {
        flex: 1,
        flexBasis: '80%',
    },

    eventRow: {
        backgroundColor:'#eee', 
        borderColor:'black', 
        borderWidth:1, 
        paddingHorizontal: 10,
        borderRadius: 5, 
        marginHorizontal: 5,
        justifyContent: 'center', 
        alignItems: 'center',
        display: 'flex'
    },

    eventRowText: {
        fontSize: 14, 
        flex: 1,
        textAlign: 'left', 
        alignSelf: 'stretch'
    },

    eventRowImage: {
        width: 60, 
        height: 60,
        flex: 1, resizeMode: 'contain', 
    },

    loadingViewPadding: {
        flex: 1, 
        padding: 20
    },

    backgroundImage:{
        height: '100%',
        width: '100%',
        opacity: 0.5
    },

    categoryIcon: {
        flex: 1, 
        resizeMode: 'contain', 
        width: 60, 
        height: 60,
        paddingHorizontal: '10%'
    },

    wrapper: {
        paddingTop:20,
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: 5,
        paddingRight: 5,
    },
    
    topBarWrapper: {
        flex:.15,
        justifyContent: 'center',
        alignItems: 'center'
    },

    topBarContent: {
        height: 45,
        flexDirection: 'row',
        paddingTop: 5, 
        paddingHorizontal: 5,
        paddingLeft: 7, 
        justifyContent: 'center',
        borderColor: 'black', 
        borderRadius: 35, 
        borderWidth: 1, 
        width: 360, 
        backgroundColor: '#fff', 
        alignItems: 'center'
    },

    searchBar: {
        flex:1, 
        width: 50,
    },

    iosSearch: {
        fontSize: 24
    },

    dateText: {
        fontWeight: 'bold',
        fontSize:20,
        marginHorizontal: 5
    },
    
    header: {
        fontSize:22, 
        fontWeight:'bold',
        paddingTop: 15
    },

    defaultButtonTextStyle: {
        fontSize:13,
        color: '#efe0d5',
        textAlign: 'center'
    },

    textInput: {
        borderColor: 'black',
        borderWidth: 1, 
        width: 320, 
        backgroundColor: '#fff', 
        paddingTop: 35, 
        alignItems: 'center',
        justifyContent: 'center'
    },

    advancedSearchRow: {
        height: 100, 
        flexDirection: 'row', 
        paddingTop:20,  
        alignItems: 'center'
    },

    advancedSearchColumn: {
        flex:5
    },

    textBox: {
        flexGrow: 1,
        height: 40,
        borderColor: 'gray', 
        borderWidth: 1,
    },
        
    textArea: {
        height: 160, 
        borderColor: 'gray', 
        borderWidth: 1
    },

    formRow:{
        //flexDirection: 'row',
        paddingBottom: 10,
        flex: 1
    },

    formLabel:{
        flex: 0, 
        fontWeight: 'bold', 
        fontSize: 25
    },

    formEntry:{
        flex: 1,
    },

    requiredField:{
        fontSize: 15
    },

    embeddedSwitch: {
        paddingLeft: '20%',
        flexDirection: 'row'

    },

    defaultButtonStyle: {
        height:30,
        width:40,
        backgroundColor: '#cb532b',
        borderRadius:5,
        justifyContent: 'center', 
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',

    },

    longButtonStyle: {
        width: '100%',
        alignItems: 'center',
        textAlign: 'center',
        height:50,
        
    },

    longButtonTextStyle: {
        fontSize:18
    },

    mediumButtonStyle: {
        width:100
    },

    mediumButtonTextStyle:{
        fontSize: 15
    },
    buttonBuffer: {
        flex: 0.1,
        paddingTop: '1%'
    }

});