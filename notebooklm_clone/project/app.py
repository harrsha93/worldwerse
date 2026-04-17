import streamlit as st
from pypdf import PdfReader

st.set_page_config(page_title="NotebookLM Clone")
st.title("📚 AI PDF Assistant")

uploaded_file = st.file_uploader("Upload PDF", type="pdf")

if uploaded_file:
    st.success("PDF Loaded!")

    option = st.selectbox("Choose Action", [
        "Summary", "Ask Question", "Flowchart"
    ])

    user_q = st.text_input("Ask something (if needed)")

    if option == "Summary":
        if st.button("Generate Summary"):
            st.write(summarize(text))

    elif option == "Ask Question":
        if st.button("Get Answer"):
            st.write(ask_question(text, user_q))

    elif option == "Flowchart":
        if st.button("Generate Flowchart"):
            result = generate_flowchart(text)
            st.code(result, language="markdown")